import Applicant from "../models/applicant";

import httpResponse from "../utils/httpResponses";

const confirmed = async (req, res) => {
  try {
    const confirmed = await Applicant.find({ confirmed: true });

    httpResponse.successResponse(res, confirmed);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const unconfirmed = (req, rss) => {};

const females = (req, res) => {};

const males = (req, res) => {};

const school = (req, res) => {};

export default { confirmed, unconfirmed, females, males, school };
