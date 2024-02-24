import {
  Gabriela,
  Inter,
  Lora,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Poppins,
  Roboto,
  Spectral,
} from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const inter = Inter({
  subsets: ["latin"],
});

export const gabriela = Gabriela({
  subsets: ["latin"],
  weight: "400",
});

export const lora = Lora({
  subsets: ["latin"],
});

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: "400",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export const spectral = Spectral({
  subsets: ["latin"],
  weight: "400",
});
