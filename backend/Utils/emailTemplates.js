export const verificationEmailTemplate = (token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  return `
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center;">
      <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 20px; margin: auto; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Verify Your Login</h2>
        <p style="font-size: 16px; color: #555555;">
          We noticed a login attempt to your account. Please verify your identity by clicking the button below. This link will expire in <strong>5 minutes</strong>:
        </p>
<a href="${verificationLink}" style="
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #1d4ed8;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease;
">
  Verify Email
</a>
        <p style="margin-top: 20px; font-size: 14px; color: #777777;">If you did not attempt this login, please ignore this email or reset your password immediately.</p>
      </div>
    </div>
  `;
};

// 1. Lender to Borrower Email Template
export const lenderToBorrowerTemplate = (
  borrower,
  lender,
  initialAmount,
  description,
  isCleared,
  isRegistered,
  registrationLink
) => {
  // Conditional message based on repayment status
  const header = isCleared
    ? `Great News, ${borrower}!`
    : `Reminder for Loan Repayment, ${borrower}`;

  const mainMessage = isCleared
    ? `I am pleased to inform you that your loan repayment of ₹${initialAmount} has been successfully received and marked as fully cleared. Thank you for settling your dues!`
    : `This is a gentle reminder that you have an outstanding loan repayment of ₹${initialAmount} that is yet to be cleared. Kindly ensure the payment at the earliest.`;

  // Dynamic subject message for the email
  const subjectMessage = isCleared
    ? `Confirmation: Loan Successfully Cleared ✅`
    : `Reminder: Loan Repayment Due ⚠️`;

  const descriptionMessage = description
    ? `<p class="mt-4 text-gray-600"><strong>Details:</strong> ${description}</p>`
    : "";

  // If borrower is not registered, include the registration message
  const registrationMessage = !isRegistered
    ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #fffbcc; border-left: 5px solid #ffcc00;">
        <p style="color: #555555; font-size: 16px;">
          We noticed that you are not yet registered on our platform. To manage your loans and repayments easily, please register using the link below:
        </p>
        <p style="text-align: center; margin-top: 10px;">
          <a href="${registrationLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Complete Registration
          </a>
        </p>
      </div>
    `
    : "";

  // Return both HTML content and subject message
  return {
    subject: subjectMessage,
    html: `
      <div style="background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 20px; margin: auto; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">${header}</h2>
          <p style="font-size: 16px; color: #555555;">${mainMessage}</p>
          ${descriptionMessage}
          ${registrationMessage} <!-- Registration section added -->
          <p style="margin-top: 20px; font-size: 16px; color: #666666;">Please review your records and confirm accordingly.</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #dddddd;" />

          <p style="font-size: 14px; color: #999999;">Best regards,</p>
          <p style="font-size: 16px; font-weight: bold; color: #333333;">${lender}</p>

          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #cccccc;">
              This email has been sent by ${lender} regarding your loan repayment.
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

// 2. Borrower to Lender Email Template
export const borrowerToLenderTemplate = (
  lender,
  borrower,
  initialAmount,
  description,
  isCleared
) => {
  // Conditional message based on repayment status
  const header = isCleared
    ? `Good News, ${lender}!`
    : `Update on Loan Repayment, ${lender}`;

  const mainMessage = isCleared
    ? `I am pleased to inform you that I have successfully repaid the loan amount of ₹${initialAmount} in full. The payment has been completed, and the loan is now cleared.`
    : `I acknowledge the pending loan repayment of ₹${initialAmount} and would like to assure you that I am actively working towards settling the remaining amount soon.`;

  // Dynamic subject message for the email
  const subjectMessage = isCleared
    ? `Confirmation: Loan Repayment Completed ✅`
    : `Acknowledgment: Loan Repayment in Progress`;

  const descriptionMessage = description
    ? `<p class="mt-4 text-gray-600"><strong>Details:</strong> ${description}</p>`
    : "";

  // Return both HTML content and subject message
  return {
    subject: subjectMessage,
    html: `
      <div style="background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 20px; margin: auto; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">${header}</h2>
          <p style="font-size: 16px; color: #555555;">${mainMessage}</p>
          ${descriptionMessage}
          <p style="margin-top: 20px; font-size: 16px; color: #666666;">Please update your records accordingly.</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #dddddd;" />

          <p style="font-size: 14px; color: #999999;">Best regards,</p>
          <p style="font-size: 16px; font-weight: bold; color: #333333;">${borrower}</p>

          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #cccccc;">
              This email has been sent by ${borrower} regarding the status of loan repayment to you.
            </p>
          </div>
        </div>
      </div>
    `,
  };
};
