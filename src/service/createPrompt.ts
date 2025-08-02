export function createPrompt({
  senderName,
  senderPhoneNumber,
  aboutSender,
  senderPortfolio,
  senderEducation,
  senderExperiences,
  senderSkills,
  senderProjects,
  recipientName,
  companyName,
  positionForCompany,
  areaOfInterest,
  jobId,
  includeProjects,
  includePortfolio,
  includeEducation,
  includePastExperiences,
  customPrompt,
  attachmentsAdded,
}: {
  senderName: string;
  senderPhoneNumber?: string;
  aboutSender?: string;
  senderPortfolio?: string;
  senderEducation?: string[];
  senderExperiences?: string[];
  senderSkills?: string[];
  senderProjects?: string[];
  recipientName?: string;
  companyName?: string;
  positionForCompany?: string;
  areaOfInterest?: string;
  jobId?: string;
  includeProjects: boolean;
  includePortfolio: boolean;
  includeEducation: boolean;
  includePastExperiences: boolean;
  customPrompt?: string;
  attachmentsAdded: boolean;
}): string {
  let prompt = "";
  const startingPrompt = process.env.STARTING_MANDATORY_PROMPT || "";
  const endingPrompt = process.env.ENDING_MANDATORY_PROMPT || "";

  prompt += startingPrompt;

  prompt += " About Mail: ";

  prompt += " sender Name- " + senderName + ", ";

  if (isValidParameter({ parameter: senderPhoneNumber })) {
    prompt += " sender PhoneNumber - " + senderPhoneNumber + ", ";
  }

  if (isValidParameter({ parameter: aboutSender })) {
    prompt += " about sender - " + aboutSender + ", ";
  }

  if (isValidParameter({ parameter: senderPortfolio }) && includePortfolio) {
    prompt += " add portoflioLink in description - " + senderPortfolio + ", ";
  }

  if (
    senderEducation != null &&
    senderEducation.length != 0 &&
    includeEducation
  ) {
    prompt += " Add about senders education - ";
    senderEducation.forEach((education) => {
      prompt += education + ", ";
    });
    prompt += ". ";
  }

  if (
    senderExperiences != null &&
    senderExperiences.length != 0 &&
    includePastExperiences
  ) {
    prompt += " Add about senders professional Experience - ";
    senderExperiences.forEach((experience) => {
      prompt += experience + ", ";
    });
    prompt += ". ";
  }

  if (senderSkills != null && senderSkills.length != 0) {
    prompt += " Add about senders skills - ";
    senderSkills.forEach((experience) => {
      prompt += experience + ", ";
    });
    prompt += ". ";
  }

  if (senderProjects != null && senderProjects.length != 0 && includeProjects) {
    prompt += " Add about senders projects - ";
    senderProjects.forEach((projects) => {
      prompt += projects + ", ";
    });
    prompt += ". ";
  }

  if (isValidParameter({ parameter: recipientName })) {
    prompt += " Recipents name: " + recipientName;
  } else {
    prompt += "we don't know the recipents name .";
  }

  if (isValidParameter({ parameter: companyName })) {
    prompt += " company name: " + companyName;
  } else {
    prompt += "we don't know the company's name .";
  }

  if (isValidParameter({ parameter: positionForCompany })) {
    prompt += " Position to be applying for: " + positionForCompany;
  } else {
    prompt += "Don't mention about position we are applying for.";
  }

  if (isValidParameter({ parameter: areaOfInterest })) {
    prompt += " area of interest: " + areaOfInterest;
  } else {
    prompt += "Don't mention about any interest.";
  }

  if (isValidParameter({ parameter: jobId })) {
    prompt += " JobId: " + jobId;
  } else {
    prompt += "Don't mention about any jobId.";
  }

  if (isValidParameter({ parameter: customPrompt })) {
    prompt += " " + customPrompt + ". ";
  }

  if (attachmentsAdded) {
    prompt += " Mention about added attachments";
  } else {
    prompt += " Don't mention anything about attachments";
  }

  prompt += endingPrompt;

  return prompt;
}

function isValidParameter({ parameter }: { parameter?: string }) {
  return parameter != null && parameter.trim() != "";
}
