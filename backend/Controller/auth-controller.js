import crypto from "crypto";
import User from "../Model/auth-model.js";
import sendMail from "../Utils/emailConfig.js";
import { verificationEmailTemplate } from "../Utils/emailTemplates.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email Already Exists",
        needsVerification: !userExists.isVerified,
      });
    }

    // Generate verification token and hash it for storing in DB
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Create the user in the database with verification fields
    const userCreated = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken: hashedToken,
      verificationExpires: Date.now() + 5 * 60 * 1000,
    });

    // Send verification email with HTML content using the template
    const htmlContent = verificationEmailTemplate(verificationToken);
    const emailSent = await sendMail(email, "Verify Your Email", htmlContent);

    if (!emailSent.success) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    // Send success response
    res.status(201).json({
      message: "User Registered Successfully. Check your email to verify.",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
      needsVerification: true,
    });
  } catch (error) {
    next(error);
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Invalid token" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user not found" });
    }

    if (!user.verificationToken || user.verificationExpires < Date.now()) {
      return res.status(400).json({
        message: "Token expired! Please request a new verification email.",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    res.json({
      message: "Email verified successfully! You can now log in.",
      token: await user.generateToken(),
    });
  } catch (error) {
    next(error);
  }
};
const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.verificationToken && user.verificationExpires > Date.now()) {
      return res.status(400).json({
        message:
          "Please wait until your previous token expires before requesting a new one.",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.verificationToken = hashedToken;
    user.verificationExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const htmlContent = verificationEmailTemplate(verificationToken);
    await sendMail(user.email, "Verify Your Email", htmlContent);

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!userExist.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await userExist.comparePassword(password);

    if (isMatch) {
      res.status(200).json({
        message: "User Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    next(error);
  }
};
const user = async (req, res, next) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    next(error);
  }
};
const userUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const photo = req.file ? req.file.filename : null;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (photo) user.photo = photo;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully!", user });
  } catch (error) {
    next(error);
  }
};

export default { register, verifyEmail, resendEmail, login, user, userUpdate };
