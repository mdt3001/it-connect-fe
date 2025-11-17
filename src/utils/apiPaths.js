export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: (id) => `/api/user/${id}`,
    DELETE_RESUME: "/api/user/resume",

    // Forgot password
    FORGOT_PASSWORD: "/api/auth/password-reset/send-code",
    VERIFY_CODE: "/api/auth/password-reset/verify-code",
    RESET_PASSWORD: "/api/auth/password-reset/reset",
    RESEND_CODE: "/api/auth/password-reset/resend-code",
  },
  DASHBOARD: {
    OVERVIEW: "/api/analytics/overview",
  },
  JOB: {
    GET_ALL_JOBS: "/api/jobs/getJobStatus",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    POST_JOB: "/api/jobs/",
    GET_JOB_EMPLOYER: "api/jobs/get-jobs-employer",
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toogle-close`,
    SAVE_JOB: (id) => `/api/save-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/save-jobs/${id}`,
    GET_SAVED_JOBS: "/api/save-jobs/my",
  },

  APPLICATION: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
