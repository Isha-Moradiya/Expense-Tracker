import User from "../Model/auth-model.js";
import BorrowedMoney from "../Model/borrow-model.js";
import LentMoney from "../Model/lent-model.js";
import sendMail from "../Utils/emailConfig.js";
import { lenderToBorrowerTemplate } from "../Utils/emailTemplates.js";
import { validateLentData } from "../Validators/lent-validator.js";

const createLent = async (req, res, next) => {
  try {
    const {
      lender,
      borrower,
      borrowerEmail,
      initialAmount,
      remainingAmount,
      description,
    } = req.body;
    const borrowerImage = req.file
      ? req.file.filename
      : "/uploads/default-profile.png";

    // Validate input values
    const { error } = validateLentData(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if an entry already exists for the same lender and borrower
    const existingLentEntry = await LentMoney.findOne({
      lender,
      borrower,
      borrowerEmail,
      initialAmount,
      description,
      status: { $ne: "Cleared" },
    });

    if (existingLentEntry) {
      return res.status(400).json({
        message: "An active entry already exists for this lender and borrower.",
      });
    }

    // Calculate repaid amount and status based on remaining amount
    const repaidAmount = initialAmount - remainingAmount;
    const status = remainingAmount > 0 ? "Unpaid" : "Cleared";

    // Create a new lent money record
    const newLentMoney = new LentMoney({
      userId: req.user._id,
      lender,
      borrower,
      borrowerEmail,
      borrowerImage,
      initialAmount,
      remainingAmount,
      repaidAmount,
      status,
      description,
    });

    // Save the new record to the database
    const savedLentMoney = await newLentMoney.save();

    // Check if the borrower exists
    const borrowerUser = await User.findOne({ email: borrowerEmail });

    if (borrowerUser) {
      // Create a corresponding borrowed entry for the borrower
      const newBorrowedMoney = new BorrowedMoney({
        userId: borrowerUser._id,
        lender,
        borrower,
        lenderEmail: req.user.email,
        borrowerEmail,
        initialAmount,
        remainingAmount,
        repaidAmount,
        status,
        description,
      });

      // Save the new borrowed money record
      await newBorrowedMoney.save();
    } else {
      const registrationLink = `${process.env.FRONTEND_URL}/`;
      const { subject, html } = lenderToBorrowerTemplate(
        borrower,
        lender,
        initialAmount,
        description,
        false,
        false,
        registrationLink
      );
      await sendMail(borrowerEmail, subject, html);
    }

    res.status(201).json({
      message: "Lent money record created successfully!",
      data: savedLentMoney,
    });
  } catch (error) {
    next(error);
  }
};

const updateLent = async (req, res, next) => {
  try {
    const {
      lender,
      borrower,
      borrowerEmail,
      initialAmount,
      remainingAmount,
      description,
    } = req.body;
    const borrowerImage = req.file ? req.file.filename : "default-profile.png";

    // Validate input values
    const { error } = validateLentData(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Find the existing lent money record by ID (lender's perspective)
    const lentMoneyRecord = await LentMoney.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!lentMoneyRecord)
      return res.status(404).json({ message: "Lent money record not found." });

    // Find the borrower's corresponding entry in BorrowedMoney
    const borrowedMoneyRecord = await BorrowedMoney.findOne({
      lender: lentMoneyRecord.lender,
      borrower: lentMoneyRecord.borrower,
      initialAmount: lentMoneyRecord.initialAmount,
    });

    // Recalculate repayment details
    const repaidAmount = initialAmount - remainingAmount;
    const status = remainingAmount > 0 ? "Unpaid" : "Cleared";

    // Update lender's record (LentMoney)
    lentMoneyRecord.lender = lender || lentMoneyRecord.lender;
    lentMoneyRecord.borrower = borrower || lentMoneyRecord.borrower;
    lentMoneyRecord.borrowerEmail =
      borrowerEmail || lentMoneyRecord.borrowerEmail;
    lentMoneyRecord.borrowerImage =
      borrowerImage || lentMoneyRecord.borrowerImage;
    lentMoneyRecord.initialAmount =
      initialAmount !== undefined
        ? initialAmount
        : lentMoneyRecord.initialAmount;
    lentMoneyRecord.remainingAmount =
      remainingAmount !== undefined
        ? remainingAmount
        : lentMoneyRecord.remainingAmount;
    lentMoneyRecord.description = description || lentMoneyRecord.description;
    lentMoneyRecord.repaidAmount = repaidAmount;
    lentMoneyRecord.status = status;

    // Update borrower's record (BorrowedMoney)
    if (borrowedMoneyRecord) {
      borrowedMoneyRecord.lender = lender || borrowedMoneyRecord.lender;
      borrowedMoneyRecord.borrower = borrower || borrowedMoneyRecord.borrower;
      borrowedMoneyRecord.borrowerEmail =
        borrowerEmail || borrowedMoneyRecord.borrowerEmail;
      borrowedMoneyRecord.borrowerImage =
        borrowerImage || borrowedMoneyRecord.borrowerImage;
      borrowedMoneyRecord.initialAmount =
        initialAmount !== undefined
          ? initialAmount
          : borrowedMoneyRecord.initialAmount;
      borrowedMoneyRecord.remainingAmount =
        remainingAmount !== undefined
          ? remainingAmount
          : borrowedMoneyRecord.remainingAmount;
      borrowedMoneyRecord.description =
        description || borrowedMoneyRecord.description;
      borrowedMoneyRecord.repaidAmount = repaidAmount;
      borrowedMoneyRecord.status = status;

      await borrowedMoneyRecord.save();
    }

    // Check if borrower is registered
    const borrowerUser = await User.findOne({ email: borrowerEmail });
    // Send email to borrower if the loan is cleared
    if (status === "Cleared" || !borrowerUser) {
      const registrationLink = `${process.env.FRONTEND_URL}/register`;
      const { subject, html } = lenderToBorrowerTemplate(
        borrower,
        lender,
        initialAmount,
        description,
        status === "Cleared",
        !!borrowerUser,
        registrationLink
      );
      await sendMail(borrowerEmail, subject, html);
    }

    // Save the updated lender record
    const updatedRecord = await lentMoneyRecord.save();

    res.status(200).json({
      message: "Lent money record updated successfully!",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getLent = async (req, res, next) => {
  try {
    const lentMoneyRecords = await LentMoney.find({ userId: req.user._id });

    // Calculate total amounts using reduce
    const totalInitialAmount = lentMoneyRecords.reduce(
      (sum, record) => sum + record.initialAmount,
      0
    );

    // Return the retrieved records
    res.status(200).json({
      message: "Lent money records fetched successfully!",
      data: lentMoneyRecords,
      totalInitialAmount,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLent = async (req, res, next) => {
  try {
    const lentMoneyRecord = await LentMoney.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!lentMoneyRecord) {
      return res.status(404).json({ message: "Lent money record not found." });
    }

    // Delete the record
    await LentMoney.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Lent money record deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export default { createLent, getLent, updateLent, deleteLent };
