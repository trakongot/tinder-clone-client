import * as yup from 'yup'

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
  username: yup
    .string()
    .required('Username là bắt buộc')
    .min(5, 'Độ dài từ 5 - 30 ký tự')
    .max(30, 'Độ dài từ 5 - 30 ký tự'),
  pass: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 5 - 30 ký tự')
    .max(30, 'Độ dài từ 5 - 30 ký tự'),
  confirm_pass: handleConfirmPasswordYup('password')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 30 ký tự')
    .max(30, 'Độ dài từ 5 - 30 ký tự'),
  pass: schema.fields['pass'],
  new_passw: schema.fields['pass'],
  confirm_pass: handleConfirmPasswordYup('new_pass')
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>
