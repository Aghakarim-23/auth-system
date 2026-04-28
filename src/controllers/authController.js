import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const register = async (req, res) => {
  try {
    const { name, surname, username, email, password } = req.body;

    const existed = await User.findOne({ email });
    if (existed)
      return res.status(400).json({ message: "Bu email artıq mövcuddur" });

    const existedUsername = await User.findOne({ username });
    if (existedUsername)
      return res
        .status(400)
        .json({ message: "Bu istifadəçi adı artıq mövcuddur" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      message: "Qeydiyyat tamamlandı! Zəhmət olmasa emailinizi təsdiqləyin.",
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Hesab tapılmadı. Zəhmət olmasa emaili yoxlayın" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Şifrə səhvdir. Yenidən cəhd edin" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Uğurlu giriş!",
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
};