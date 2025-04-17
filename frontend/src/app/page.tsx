import Image from "next/image";
import styles from "./page.module.css";

 // src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth');
}