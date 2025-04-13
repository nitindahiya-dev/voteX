// components/Layout.tsx
import {Navbar} from './Navbar';
import {Footer} from './Footer';
const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow md:max-w-[100vw] mx-auto">{children}</main>
     
     
      <Footer />
    </div>
  );
};

export default Layout;