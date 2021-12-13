import { z, TypeOf } from "zod";

const register = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Please enter your full name",
      }),
      email: z
        .string({
          required_error: "Please enter your email address",
        })
        .email("Please enter a valid email address"),
      password: z
        .string({
          required_error: "Please enter your password",
        })
        .min(6, "Password must be of a minimum of 6 characters"),
      confirmPassword: z.string({
        required_error: "Please enter your password confirmation",
      }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});
export type RegisterUserRequestBody = TypeOf<typeof register>;

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Please enter your email address",
      })
      .email("Please enter a valid email address"),
    password: z.string({
      required_error: "Please enter your password",
    }),
  }),
});
export type LoginRequestBody = TypeOf<typeof login>;

const sessions = z.object({});

export const UserValidators = {
  register,
  login,
  sessions,
};
