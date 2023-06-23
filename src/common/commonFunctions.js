import { toast } from "react-toastify";

export const showUnhandledErrors = (messageToDisplay) => {
  toast.error(messageToDisplay, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

export const handleOnSuccessToastify = (messageToDisplay) => {
  toast.success(messageToDisplay, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

export const setItemInLocalStorage = (
  key = "senmos_system",
  data,
  isJSONStringify = true
) => {
  // setter
  return localStorage.setItem(
    key,
    isJSONStringify ? JSON.stringify(data) : data
  );
};

export const cleanLocalStorage = () => {
  // clean
  return localStorage.clear();
};

export const validateName = (name) => {
  if (!name) {
    return {
      message: "Please enter your name",
      status: false,
    };
  }
  return {
    message: "",
    status: true,
  };
};

export const validateEmail = (email) => {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email) {
    return {
      message: "Please enter your email address",
      status: false,
    };
  }
  if (!re.test(String(email).toLowerCase())) {
    return {
      message: "Please provide a valid email address",
      status: false,
    };
  }
  return {
    message: "",
    status: true,
  };
};

export const validatePassword = (password) => {
  if (!password) {
    return {
      message: "Please enter your password",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validateOldPassword = (oldPassword) => {
  if (!oldPassword) {
    return {
      message: "Please enter your old password",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validateNewPassword = (newPassword) => {
  if (!newPassword) {
    return {
      message: "Please enter your new password",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validatePasswordConf = (passwordConf) => {
  if (!passwordConf) {
    return {
      message: "Please enter your confirm password",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validatePlanName = (planName) => {
  if (!planName) {
    return {
      message: "Please enter your plan name",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validateMonthlyPrice = (monthlyPrice) => {
  if (!monthlyPrice) {
    return {
      message: "Please enter your monthly price",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validatePrice = (price) => {
  if (!price) {
    return {
      message: "Please enter your price",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export const validateDescription = (description) => {
  if (!description) {
    return {
      message: "Please enter your description",
      status: false,
    };
  }

  return {
    message: "",
    status: true,
  };
};

export function validateFormFields(inputFieldName, inputFieldValue) {
  switch (inputFieldName) {
    case "name":
      return validateName(inputFieldValue);

    case "email":
      return validateEmail(inputFieldValue);

    case "password":
      return validatePassword(inputFieldValue);

    case "oldPassword":
      return validateOldPassword(inputFieldValue);

    case "newPassword":
      return validateNewPassword(inputFieldValue);

    case "passwordConf":
      return validatePasswordConf(inputFieldValue);

    case "planName":
      return validatePlanName(inputFieldValue);

    case "monthlyPrice":
      return validateMonthlyPrice(inputFieldValue);

    case "price":
      return validatePrice(inputFieldValue);

    case "description":
      return validateDescription(inputFieldValue);

    default:
      return {
        message: "",
        status: false,
      };
  }
}
