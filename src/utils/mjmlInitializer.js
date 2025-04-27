import { v4 as uuidv4 } from "uuid";

// Initialize email template with a default section and column
export const initializeEmailTemplate = () => {
  return {
    tagName: "mjml",
    uuid: uuidv4(),
    attributes: {},
    children: [
      // {
      //   tagName: "mj-head",
      //   attributes: {},
      //   uuid: uuidv4(),
      //   children: [
      //     {
      //       tagName: "mj-preview",
      //       attributes: {},
      //       uuid: uuidv4(),
      //       children: [],
      //     },
      //   ],
      // },
      {
        tagName: "mj-body",
        attributes: {},
        uuid: uuidv4(),
        children: [],
      },
    ],
  };
};
