import * as Yup from "yup";

export const Step1Schema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phone: Yup.string()
        .min(9, "Invalid phone number")
        .required("Phone number is required"),
    whatsapp: Yup.string()
        .min(9, "Invalid WhatsApp number")
        .required("WhatsApp number is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    gender: Yup.string().oneOf(["male", "female"]).required("Gender is required"),
    dob: Yup.date().required("Date of birth is required"),
    avatar: Yup.string().nullable(),
});

export const Step2Schema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    addressCoordinates: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
    }),
    shopAddress: Yup.string().required("Address is required"),
    shopCoordinates: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
    }),
    locationZone: Yup.string().required("Location zone is required"),
});

export const Step3Schema = Yup.object().shape({
    farmName: Yup.string().required("Farm name is required"),
    websiteURL: Yup.string().url("Must be a valid URL").nullable(),
    shopDescription: Yup.string().required("Shop description is required"),
    produceTypes: Yup.array().min(1, "Select at least one produce type"),
    shopCoordinates: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
    }),
    deliveryRadiusKm: Yup.number().min(1).max(50).required(),
});

export const Step4Schema = Yup.object().shape({
    paymentMethod: Yup.string().required("Payment method is required"),
    accountNumber: Yup.string().required("Account number is required"),
    accountName: Yup.string().required("Account name is required"),
});
