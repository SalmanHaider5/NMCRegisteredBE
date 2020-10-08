
module.exports = {

    // hostUrl: 'https://intelligent-innovation.herokuapp.com/',
    hostUrl: 'https://server.nmcregistered.org.uk/server/',
    // hostUrl: 'http://localhost:1000/',
    // appUrl: 'http://localhost:3005/',
    appUrl: 'https://nmcregistered.org.uk/',
    signupSecret: 'nightingale',
    tokenExpiration: 12000, // In Seconds
    linkExpiration: 20, // In minutes
    codeExpiration: 10, // In minutes

    responseMessages: {
        alreadyRegistered: 'Email is already registered. Please login into your account',
        emailSent: 'Email has been sent to you, please verify your account. Activation link is valid for only 20 minutes',
        generalErrorMessage: 'Something went wrong',
        linkExpired: 'Activation link has been expired, please register again and verify your account',
        alreadyVerified: 'Your account is already verified. Please login into your account',
        linkBroken: 'Activation link is broken. Please try again to verify or register again ',
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
        secretRetrieved: 'Payment Secret has been retrieved successfully',
        paymentReceived: 'Your payment has been received.',
        bankDetailsRequired: 'Please add your bank details',
        bankDetailsAdded: 'Bank details has been successfully added',
        offerSent: 'Your offer request has been sent to professional',
        offerAccepted: 'You have successfully accepted this offer',
        offerDeclined: 'You have successfully declined this offer'
    },

    emailCredentials: {
        service: 'smtp.gmail.com',
        email: 'malachy2@gmail.com',
        password: '75122817',
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
        bankDetails: 'bankDetail'
    },

    stripeCredentials: {
        secretKey: 'sk_test_1CKG3l4djbNIKfpHOD3Yrs3o00s2auBOs1',
        amount: '495',
        vatPercent: '20',
        currency: 'gbp',
        paymentIntentId: 'pi_1Gb3gdHrrJ26Tytgj2IdeMq4'
    },
    braintreeCredentials: {
        merchantId: 'wm733scpkh998vsc',
        publicKey: 'jj7zg2csp5ppmj25',
        privateKey: '3918d7f4464c74cbcaab666ea568c402'
    }
}