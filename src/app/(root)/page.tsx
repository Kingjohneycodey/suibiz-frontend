import Link from "next/link";
export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/user">User Dashboard</Link>
        </li>
        <li>
          <Link href="/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link href="/bussiness">Bussiness Dashboard</Link>
        </li>
        <li>
          <Link href="/auth/login">Login Auth</Link>
        </li>
        <li>
          <Link href="/auth/register">Register Auth</Link>
        </li>
        <li>
          <Link href="/services">Services</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/faq">Faq Dashboard</Link>
        </li>
        <li>
          <Link href="/marketplace">marketplace</Link>
        </li>
      </ul>
    </div>
  );
}
