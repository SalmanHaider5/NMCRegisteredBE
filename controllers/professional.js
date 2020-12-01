const { QueryTypes } = require('sequelize')
const SendMessage    = require('../config/message')

const {
    Professional,
    User,
    Phone,
    Timesheet,
    SingleTimesheet,
    BankDetails,
    sequelize
}  = require('../models')

const {
    getResponse,
    getGeneralErrorMessage,
    setProfessionalBody,
    getTwoFactorAuthTitle,
    isPasswordValid,
    getHashedPassword,
    getRandomCode,
    setPhoneInitialValues,
    isActivationLinkExpired,
    setProfessionalInitialValues,
    getProfessionalOffersQuery,
    getTimesheetsTitleMessage
} = require('./helpers')

const {
    codes:{
        error,
        success,
        info
    },
    responseMessages:{
        recordAdded,
        generalErrorMessage,
        phoneAdded,
        phoneVerified,
        phoneAlreadyVerified,
        phoneAlreadyUsed,
        falseCode,
        codeExpired,
        recordFound,
        phoneVerification,
        profileUpdated,
        invalidCurrentPassword,
        timesheetAdded,
        timesheetsFound,
        shiftStatusChanged,
        shiftChanged,
        timesheetDeleted,
        bankDetailsRequired,
        bankDetailsAdded,
    }
} = require('../constants')

exports.create = (req, res) => {
    const { params: { userId }, files, body } = req
    Professional.create(setProfessionalBody(userId, files, body))
    .then(() => {
        const response = getResponse(success, 'Profile Added', recordAdded)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.verifyProfessional = (req, res, next) => {
    const { params: { userId } } = req
    Professional.findOne({ where: { userId } })
    .then(professional => {
        if(professional){
            req.professional = professional
            next();
        }else{
            const response = getGeneralErrorMessage({})
            res.json(response)
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.updateProfessional = (req, res) => {
    const { params: { userId }, body, files } = req
    Professional.update(setProfessionalBody(userId, files, body), { where: { userId } })
    .then(() => {
        const response = getResponse(success, 'Profile Updated', profileUpdated)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.updateProfessionalSecurityDetails = (req, res) => {
    const { params: { userId, type }, user: { dataValues: { password } } } = req
    const { body: { twoFactorAuthentication } } = req
    Professional.update({ twoFactorAuthentication }, { where: { userId } })
    .then(() => {
        if(type === 'password'){
            const { body: { currentPassword, newPassword } } = req
            if(isPasswordValid(currentPassword, password)){
                User.update({ password: getHashedPassword(newPassword) }, { where: { id: userId } })
                .then(() => {
                    const response = getResponse(success, 'Security Details Updated', profileUpdated)
                    res.json(response)
                })
                .catch(err => {
                    const response = getGeneralErrorMessage(err)
                    res.json(response)
                })
            }else{
                const response = getResponse(error, 'Invalid Password', invalidCurrentPassword)
                res.json(response)
            }
        }else{
            const response = getResponse(success, getTwoFactorAuthTitle(twoFactorAuthentication), profileUpdated)
            res.json(response)
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.addPhone = (req, res) => {
    const { params: { userId }, body: { phone } } = req
    Phone.findOne({ where: { userId } })
    .then(data => {
        if(data){
            const { dataValues: { status } } = data
            if(status){
                const response = getResponse(info, 'Phone already Verified', phoneAlreadyVerified)
                res.json(response)
            }else{
                const code = getRandomCode()
                const message = `Your verification code is ${code}`
                SendMessage(phone, message)
                Phone.update({ phone, code }, { where: { id: data.id } })
                .then(() => {
                    const response = getResponse(success, 'Phone Added', phoneAdded)
                    res.json(response)
                })
                .catch(err => {
                    const response = getGeneralErrorMessage(err)
                    res.json(response)
                })
            }
        }else{
            Phone.findOne({ where: { phone, status: true } })
            .then(model => {
                if(model){
                    const response = getResponse(error, 'Phone already in Use', phoneAlreadyUsed)
                    res.json(response)
                }else{
                    const code = getRandomCode()
                    const message = `Your verification code is ${code}`
                    SendMessage(phone, message)
                    Phone.create(setPhoneInitialValues(userId, code, phone))
                    .then(() => {
                        const response = getResponse(success, 'Phone Added', phoneAdded)
                        res.json(response)
                    })
                    .catch(err => {
                        const response = getGeneralErrorMessage(err)
                        res.json(response)
                    })
                }
            })
            .catch(err => {
                const response = getGeneralErrorMessage(err)
                res.json(response)
            })
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.verifyPhone = (req, res) => {
    const { params: { userId }, body: { code: reqCode } } = req
    Phone.findOne({ where: { userId: userId } })
    .then(model => {
        if(model){
            const { dataValues: { code, updatedAt, status } } = model
            if(code === reqCode){
                if(status){
                    const response = getResponse(error, 'Phone already Verified', phoneAlreadyVerified)
                    res.json(response)
                }else{
                    if(isActivationLinkExpired(updatedAt, 'phone')){
                        const response = getResponse(error, 'Code Expired', codeExpired)
                        res.json(response)
                    }else{
                        Phone.update({ status: true }, { where: { userId } })
                        .then(() => {
                            const response = getResponse(success, 'Phone Verified', phoneVerified)
                            res.json(response)
                        })
                        .catch(err => {
                            const response = getGeneralErrorMessage(err)
                            res.json(response)
                        })
                    }   
                }
            }else{
                const response = getResponse(error, 'Invalid Code', falseCode)
                res.json(response)
            }
        }else{
            const response = getResponse(error, 'Invalid Request', generalErrorMessage)
            res.json(response)
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.getProfessionalDetails = (req, res) => {
    const { params: { userId }, user: { dataValues: userData } } = req
    Professional.findOne({ where: { userId } })
    .then(professional => {
        if(professional){
            Phone.findOne({ where: { userId } })
            .then(model => {
                if(model){
                    const { dataValues: phone } = model
                    BankDetails.findOne({ where: { userId } })
                    .then(details => {
                        if(details){
                            sequelize.query(getProfessionalOffersQuery(userId), { type: QueryTypes.SELECT })
                            .then(offers => {
                                const data = setProfessionalInitialValues(userData, phone, professional.dataValues, offers.dataValues)
                                const response = getResponse(success, 'Perfect Profile', recordFound, data)
                                res.json(response)
                            })
                            .catch(err => {
                                const response = getGeneralErrorMessage(err)
                                res.json(response)
                            })
                        }else{
                            const data = setProfessionalInitialValues(userData, phone, {}, professional.dataValues)
                            const response = getResponse(info, 'Bank Details Required', bankDetailsRequired, data)
                            res.json(response)
                        }
                    })
                }else{
                    const response = getGeneralErrorMessage({})
                    res.json(response)
                }
            })
            .catch(err => {
                const response = getGeneralErrorMessage(err)
                res.json(response)
            })
        }else{
            Phone.findOne({ where: { userId } })
            .then(model => {
                if(model){
                    const { dataValues } = model
                    const data = setProfessionalInitialValues(userData, dataValues)
                    const response = getResponse(info, 'Phone Verification Required', phoneVerification, data)
                    res.json(response)
                }else{
                    const data = setProfessionalInitialValues(userData, {})
                    const response = getResponse(info, 'Phone Verification Required', phoneVerification, data)
                    res.json(response)
                }
            })
            .catch(err => {
                const response = getGeneralErrorMessage(err)
                res.json(response)
            })
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.addTimesheet = (req, res) => {
    const { params: { userId }, body } = req
    const { timesheet, singleTimesheet } = body
    timesheet.userId = userId
    Timesheet.create(timesheet)
    .then(model => {
        const { id } = model
        const schedule = []
        for(let i = 0; i < singleTimesheet.length; i++){
            singleTimesheet[i].timesheetId = id
            SingleTimesheet.create(singleTimesheet[i])
            .then(data => {
                schedule.push(data)
                if(schedule.length === singleTimesheet.length){
                    const data = { timesheetId: id, schedule }
                    const response = getResponse(success, 'Timesheet Added', timesheetAdded, data)
                    res.json(response)
                }
            })
            .catch(err => {
                if(i === singleTimesheet.length - 1){
                    const response = getGeneralErrorMessage(err)
                    res.json(response)
                }
            })
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.getSingletimesheet = (req, res) => {
    const { params: { timesheetId } } = req
    SingleTimesheet.findAll({ where: { timesheetId } })
    .then(timesheet => {
        const response = getResponse(success, '', '', timesheet)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.getTimesheets = (req, res) => {
    const { params: { userId } } = req
    Timesheet.findAll({
        where: { userId },
        order: [
            ['startingDay', 'ASC']
        ]
    })
    .then(model => {
        const code = model.length === 5 ? success : info
        const title = getTimesheetsTitleMessage(model.length)
        const response = getResponse(code, title, timesheetsFound, model)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.updateShiftStatus = (req, res) => {
    const { params: { shift, status } } = req
    SingleTimesheet.update({ status }, { where: { id: shift } })
    .then(() => {
        const response = getResponse(success, 'Status Updated', shiftStatusChanged)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.updateTimesheetShift = (req, res) => {
    const { params: { shiftId }, body } = req
    SingleTimesheet.update(body, { where: { id: shiftId } })
    .then(() => {
        const response = getResponse(success, 'Shift Modified', shiftChanged)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.deleteTimesheet = (req, res) => {
    const { params: { timesheetId } } = req
    Timesheet.destroy({ where: { id: timesheetId } })
    .then(() => {
        SingleTimesheet.destroy({ where: { timesheetId } })
        .then(() => {
            const response = getResponse(success, 'Timesheet Deleted', timesheetDeleted)
            res.json(response)
        })
        .catch(err => {
            const response = getGeneralErrorMessage(err)
            res.json(response)
        })
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
} 

exports.addBankDetails = (req, res) => {
    const { params: { userId } } = req
    let { body } = req
    body.userId = userId
    BankDetails.create(body)
    .then(() => {
        const response = getResponse(success, 'Bank Details Added', bankDetailsAdded)
        res.json(response)
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}

exports.updatedBankDetails = (req, res) => {
    const { params: { userId }, body } = req
    BankDetails.findOne({ where: { userId } })
    .then(model => {
        if(model){
            BankDetails.update(body, { where: { userId } })
            .then(() => {
                const response = getResponse(success, 'Bank Details Modified', profileUpdated)
                res.json(response)
            })
            .catch(err => {
                const response = getGeneralErrorMessage(err)
                res.json(response)
            })
        }else{
            const response = getResponse(error, 'Invalid Request', generalErrorMessage)
            res.json(response)
        }
    })
    .catch(err => {
        const response = getGeneralErrorMessage(err)
        res.json(response)
    })
}