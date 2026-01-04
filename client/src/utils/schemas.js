import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Невірний email" }),
  password: z
    .string()
    .min(6, { message: "Пароль має містити принаймні 6 символів" }),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, { message: "Вкажіть ім'я" }),
  lastName: z.string().min(1, { message: "Вкажіть прізвище" }),
  email: z.string().email({ message: "Невірний email" }),
  password: z
    .string()
    .min(6, { message: "Пароль має містити принаймні 6 символів" }),
  confirmPassword: z.string().min(6, { message: "Підтвердіть пароль" }),
  phone: z.string().optional(),
  cardType: z.string().optional(),
});


export const registerSchemaWithConfirm = registerSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  }
);

export const orderSchema = z.object({
  items: z
    .array(z.object({ bouquetId: z.string(), quantity: z.number().min(1) }))
    .min(1, { message: "Кошик порожній" }),
  deliveryId: z.string().nullable().optional(),
  packagingId: z.string().min(1, { message: "Оберіть упаковку" }),
  deliveryAddress: z
    .string()
    .min(5, { message: "Вкажіть адресу доставки" })
    .nullable()
    .optional(),
  notes: z.string().optional(),
  bonusPointsToUse: z.number().int().min(0).nullable().optional(),
});

export default { loginSchema, registerSchema, orderSchema };
