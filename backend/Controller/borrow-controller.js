import User from "../Model/auth-model.js";
import BorrowedMoney from "../Model/borrow-model.js";
import LentMoney from "../Model/lent-model.js";
import sendMail from "../Utils/emailConfig.js";
import { borrowerToLenderTemplate } from "../Utils/emailTemplates.js";
import { validateBorrowInput } from "../Validators/borrow-validator.js";

const createBorrow = async (req, res, next) => {
  try {
    const {
      borrower,
      lender,
      lenderEmail,
      initialAmount,
      remainingAmount,
      description,
    } = req.body;

    const { error } = validateBorrowInput(req.body); // Validate input using Joi schema
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if an entry already exists for the same lender and borrower
    const existingBorrowEntry = await BorrowedMoney.findOne({
      borrower,
      lender,
      lenderEmail,
      initialAmount,
      description,
      status: { $ne: "Cleared" },
    });

    if (existingBorrowEntry) {
      return res.status(400).json({
        message: "An active entry already exists for this lender and borrower.",
      });
    }

    const lenderImage = req.file ? req.file.filename : "default-profile.png";

    // Calculate repaid amount and status based on remaining amount
    const repaidAmount = initialAmount - remainingAmount;
    const status = remainingAmount > 0 ? "Unpaid" : "Cleared";

    // Create a new borrowed money record
    const newBorrowedMoney = new BorrowedMoney({
      userId: req.user._id,
      borrower,
      lender,
      lenderEmail,
      lenderImage,
      initialAmount,
      remainingAmount,
      repaidAmount,
      status,
      description,
    });

    // Save the new record to the database
    const savedBorrowMoney = await newBorrowedMoney.save();

    // Check if the lender exists
    const lenderUser = await User.findOne({ email: lenderEmail });

    if (lenderUser) {
      // Create a corresponding lent money entry for the lender
      const newLentMoney = new LentMoney({
        userId: lenderUser._id,
        lender,
        borrower,
        borrowerEmail: req.user.email,
        lenderEmail,
        initialAmount,
        remainingAmount,
        repaidAmount,
        status,
        description,
      });

      // Save the new lent money record
      await newLentMoney.save();
    } else {
      // Send an email to the lender if not registered
      const { subject, html } = borrowerToLenderTemplate(
        borrower,
        lender,
        initialAmount,
        description,
        false
      );
      await sendMail(lenderEmail, subject, html);
    }

    res.status(201).json({
      message: "Borrow money record created successfully!",
      data: savedBorrowMoney,
    });
  } catch (error) {
    next(error);
  }
};

const updateBorrow = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateBorrowInput(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      borrower,
      lender,
      lenderEmail,
      initialAmount,
      remainingAmount,
      description,
    } = req.body;

    const lenderImage = req.file ? req.file.filename : "default-profile.png";

    // Find the existing borrowed money record by ID (borrower’s perspective)
    const borrowedMoneyRecord = await BorrowedMoney.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!borrowedMoneyRecord) {
      return res
        .status(404)
        .json({ message: "Borrowed money record not found." });
    }

    // Find the lender’s corresponding entry in LentMoney
    const lentMoneyRecord = await LentMoney.findOne({
      lender: borrowedMoneyRecord.lender,
      borrower: borrowedMoneyRecord.borrower,
      initialAmount: borrowedMoneyRecord.initialAmount,
    });

    // Recalculate repayment details
    const repaidAmount = initialAmount - remainingAmount;
    const status = remainingAmount > 0 ? "Unpaid" : "Cleared";

    // Update borrower's record (BorrowedMoney)
    borrowedMoneyRecord.borrower = borrower || borrowedMoneyRecord.borrower;
    borrowedMoneyRecord.lender = lender || borrowedMoneyRecord.lender;
    borrowedMoneyRecord.lenderEmail =
      lenderEmail || borrowedMoneyRecord.lenderEmail;
    borrowedMoneyRecord.lenderImage =
      lenderImage || borrowedMoneyRecord.lenderImage;
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

    // Update lender’s record (LentMoney)
    if (lentMoneyRecord) {
      lentMoneyRecord.borrower = borrower || lentMoneyRecord.borrower;
      lentMoneyRecord.lender = lender || lentMoneyRecord.lender;
      lentMoneyRecord.borrowerEmail =
        lenderEmail || lentMoneyRecord.borrowerEmail;
      lentMoneyRecord.borrowerImage =
        lenderImage || lentMoneyRecord.borrowerImage;
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

      await lentMoneyRecord.save();
    }

    // Send email to lender if the loan is cleared
    if (status === "Cleared") {
      const { subject: clearedSubject, html: clearedHtml } =
        borrowerToLenderTemplate(
          borrower,
          lender,
          initialAmount,
          description,
          true // Loan cleared
        );
      await sendMail(lenderEmail, clearedSubject, clearedHtml);
    }

    // Save the updated borrower record
    const updatedRecord = await borrowedMoneyRecord.save();

    res.status(200).json({
      message: "Borrowed money record updated successfully!",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getBorrow = async (req, res, next) => {
  try {
    const borrowedMoneyRecords = await BorrowedMoney.find({
      userId: req.user._id,
    });

    // Calculate total borrowed amount using reduce
    const totalBorrowedAmount = borrowedMoneyRecords.reduce(
      (sum, record) => sum + record.initialAmount,
      0
    );
    res.status(200).json({
      message: "Borrow money records fetched successfully!",
      data: borrowedMoneyRecords,
      totalBorrowedAmount,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBorrow = async (req, res, next) => {
  try {
    const borrowMoneyRecord = await BorrowedMoney.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!borrowMoneyRecord) {
      return res
        .status(404)
        .json({ message: "Borrow money record not found." });
    }

    // Delete the record
    await BorrowedMoney.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Borrow money record deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
export default { createBorrow, getBorrow, updateBorrow, deleteBorrow };
