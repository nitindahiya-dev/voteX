// components/Layout.tsx
import {Navbar} from './Navbar';
import {Footer} from './Footer';
const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="">{children}</main>
     
     
      <Footer />
    </div>
  );
};

export default Layout;