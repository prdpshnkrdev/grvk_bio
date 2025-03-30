// lib/cors.ts
import Cors from "cors";

// Initialize the CORS middleware
const cors = Cors({
  origin: "*", // Allow all origins (Use specific origins in production)
  methods: ["GET", "POST", "PUT", "DELETE"],
});

import { NextApiRequest, NextApiResponse } from "next";

// Run the CORS middleware on requests
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    result: (result: unknown) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function applyCors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
}
