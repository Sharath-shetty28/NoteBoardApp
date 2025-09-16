import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length requirement
      select: false, // Exclude password from query results by default
      // matchMedia: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // At least one letter and one number
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
// export default User;

// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };
