const { stripe: { key }, config: { app, server, secret } } = require('../config/keys')

module.exports = {
    hostUrl: server,
    appUrl: app,
    signupSecret: secret,
    tokenExpiration: 1200, // In Seconds
    linkExpiration: 20, // In minutes
    codeExpiration: 10, // In minutes

    responseMessages: {
        alreadyRegistered: 'Email is already registered. Please login into your account',
        emailSent: 'Email has been sent to you, please verify your account. Activation link is valid for only 20 minutes',
        generalErrorMessage: 'Something went wrong',
        linkExpired: 'Activation link has been expired, please register again and verify your account',
        alreadyVerified: 'Your account is already verified. Please login into your account',
        linkBroken: 'Activation link is broken or expired. Please try again to verify or register again ',
        accountVerified: 'Your account has been verified please update your profile',
        recordAdded: 'Record successfully added',
        phoneAdded: 'Verification code has been sent to your phone. Code is valid for only 10 minutes',
        codeExpired: 'Code has been expired, please enter again and verify your phone',
        phoneVerified: 'Your account has been verified please update your profile',
        phoneAlreadyUsed: 'This phone has already been associated with different account',
        falseCode: 'Make sure you are typing right code as sent to you',
        noRecord: 'No record found',
        addRecord: 'Please update your profile',
        recordFound: 'Record is already added',
        phoneAlreadyVerified: 'User has already verified his phone',
        phoneVerification: 'Please verify your phone',
        userNotFound: 'Account with this email not found, please register yourself',
        userNotVerified: 'Email is not verified, please verify your account to login',
        invalidPassword: 'Password is not valid, please enter correct passowrd',
        loginSuccess: 'You have successfully logged into your account',
        tokenInvalid: 'Your authorization has been expired, please request again',
        passwordResetLinkSent: 'Password reset link has been sent to you please reset your password',
        passwordResetLinkExpired: 'Password reset link has been expired, please request again',
        passwordChangeSuccess: 'Your password has been successfully changed. Please log into your account',
        passwordChanged: 'Your password has been successfully changed',
        profileUpdated: 'Your profile has been successfully updated',
        invalidCurrentPassword: 'Your current password is not valid. Please enter correct password',
        timesheetAdded: 'Timesheet has been successfully added',
        timesheetsFound: 'You can add upto 5 timesheets',
        shiftStatusChanged: 'Your status has been successfully changed',
        shiftChanged: 'Shift has been successfully changed',
        timesheetDeleted: 'Timesheet has been successfully deleted',
        messageSent: 'Your message has been delivered. You will be reached soon',
        accessDenied: 'You are not authorized to perform this action',
        secretRetrieved: 'Add your credentials to make payment',
        paymentReceived: 'Your payment has been received.',
        bankDetailsRequired: 'Please add your bank details',
        bankDetailsAdded: 'Bank details has been successfully added',
        offerSent: 'Your offer request has been sent to professional',
        offerAccepted: 'You have successfully accepted this offer',
        offerDeclined: 'You have successfully declined this offer',
        offerApproved: 'You have successfully approved this offer',
        offerRejected: 'You have successfully rejected this offer',
        paymentUnsuccessful: 'Your payment is not verifed, please contact our Support if you have any issue.',
        locationAdded: 'Your location has been added successfully, you can login anytime using current location',
        locationAlreadyAdded: 'Your location is already added, you cannot change without proir permission',
        unauthLocation: 'Your location is not registered with this account, please try to login from registered location',
        emailUpdated: 'Your email Id has been successfully modified',
        phoneUpdated: 'Your phone has been successfully modified'
    },

    emailCredentials: {
        emailVerificationSubject: 'Account Verification',
        emailVerificationMessage: '<p>To verify your account please click on',
        resetPasswordSubject: 'Reset your Password',
        resetPasswordMessage: 'You have requested to reset your password. Please click here '
    },

    codes: {
        error: 'error',
        success: 'success',
        info: 'info'
    },

    tables: {
        token: 'token',
        user: 'user',
        professional: 'professional',
        company: 'company',
        phone: 'phone',
        timesheet: 'timesheet',
        singleTimesheet: 'singleTimesheet',
        payment: 'payment',
        offer: 'offer',
        bankDetails: 'bankDetail',
        location: 'location'
    },

    stripeCredentials: {
        secretKey: key,
        amount: '495',
        vatPercent: '20',
        currency: 'gbp',
    },
    
}