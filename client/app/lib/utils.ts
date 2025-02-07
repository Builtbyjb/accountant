import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError, ZodSchema } from "zod"

interface FormValidate {
  formData: FormData,
  formSchema: ZodSchema,
}

type ActionError<T> = Partial<Record<keyof T, string>>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Logout user
export function logOut() {
  console.log("User logged out")
  return null
}

// Get refresh token
export function refreshToken() {
  return { access: "access token", refresh: "refresh token" }
}

// validate form data
export async function validateData<ActionInput>({ formData, formSchema }: FormValidate) {
  const data = Object.fromEntries(formData);

  try {
    const validatedData = formSchema.parse(data) as ActionInput;
    return { formData: validatedData, errors: null }

  } catch (error) {
    const errors = error as ZodError<ActionInput>;

    return {
      validData: data,
      errors: errors.issues.reduce((acc: ActionError<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message

        return acc
      }, {}),
    };
  }
}