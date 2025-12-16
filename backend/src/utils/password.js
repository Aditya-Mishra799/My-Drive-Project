import bcrypt from "bcrypt"

export const hashPassword = async(password, rounds = 10) => {
    return await bcrypt.hash(password, rounds)
}
export const comparePassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}