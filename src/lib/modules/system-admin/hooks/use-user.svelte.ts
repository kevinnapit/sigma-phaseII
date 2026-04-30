import { userSchema, formFieldMap } from '../schemas/user.schemas';

type FormState = { userId: string; name: string; roleId: string };
type BooleanState = { userId: boolean; name: boolean; roleId: boolean };
type StringState = { userId: string; name: string; roleId: string };

export function useUserForm() {
   const form = $state<FormState>({ userId: '', name: '', roleId: '' });
   const touched = $state<BooleanState>({ userId: false, name: false, roleId: false });
   const errors = $state<StringState>({ userId: '', name: '', roleId: '' });

   function reset() {
      form.userId = '';
      form.name = '';
      form.roleId = '';
      touched.userId = false;
      touched.name = false;
      touched.roleId = false;
      errors.userId = '';
      errors.name = '';
      errors.roleId = '';
   }

   function parseForm() {
      return userSchema.safeParse({
         user_id: form.userId,
         name: form.name,
         role_id: form.roleId
      });
   }

   function validateField(field: keyof FormState) {
      const result = parseForm();
      errors[field] = !result.success
         ? (result.error.flatten().fieldErrors[formFieldMap[field]]?.[0] ?? '')
         : '';
   }

   function touchAndValidate(field: keyof FormState) {
      touched[field] = true;
      validateField(field);
   }

   function validateAll(): boolean {
      touched.userId = true;
      touched.name = true;
      touched.roleId = true;

      const result = parseForm();

      if (!result.success) {
         const fieldErrors = result.error.flatten().fieldErrors;
         errors.userId = fieldErrors.user_id?.[0] ?? '';
         errors.name = fieldErrors.name?.[0] ?? '';
         errors.roleId = fieldErrors.role_id?.[0] ?? '';
         return false;
      }

      errors.userId = '';
      errors.name = '';
      errors.roleId = '';
      return true;
   }

   function setFieldError(field: keyof FormState, message: string) {
      touched[field] = true;
      errors[field] = message;
   }

   return {
      get form() { return form; },
      get touched() { return touched; },
      get errors() { return errors; },
      reset,
      validateField,
      touchAndValidate,
      validateAll,
      setFieldError
   };
}