import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError, ZodSchema } from "zod"

interface FormValidate {
  request: Request,
  formSchema: ZodSchema,
}

type ActionError<T> = Partial<Record<keyof T, string>>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logOut() {
  console.log("User logged out")
  return null
}

export function refreshToken() {
  return {access: "access token", refresh: "refresh token"}
}

// validate form data
export async function validateData<ActionInput>({ request, formSchema}: FormValidate) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

  try {
    const validatedData = formSchema.parse(data) as ActionInput;
    return { formData: validatedData, errors: null }

  } catch (error) {
    const errors = error as ZodError<ActionInput>;
      
    return {
      formData: data,
      errors: errors.issues.reduce((acc: ActionError<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message

        return acc
      }, {}),
    };
  }
}