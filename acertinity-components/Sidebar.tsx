"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SidebarUptime() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    // <div
    //   className={cn(
    //     "rounded-md flex flex-col md:flex-row bg-[rgb(8,9,10)] border border-neutral-200 dark:border-neutral-700 overflow-hidden",
    //     "h-screen w-full"
    //   )}
    // >
    //   <Sidebar open={open} setOpen={setOpen} animate={false}>
    //     <SidebarBody className="justify-between gap-10 h-full">
    //       <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
    //         {open ? <Logo /> : <LogoIcon />}
    //         <div className="mt-8 flex flex-col gap-2">
    //           {links.map((link, idx) => (
    //             <SidebarLink key={idx} link={link} />
    //           ))}
    //         </div>
    //       </div>
    //       {/* <div>
    //         <SidebarLink
    //           link={{
    //             label: "Manu Arora",
    //             href: "#",
    //             icon: (
    //               <Image
    //                 src="https://assets.aceternity.com/manu.png"
    //                 className="h-7 w-7 flex-shrink-0 rounded-full"
    //                 width={50}
    //                 height={50}
    //                 alt="Avatar"
    //               />
    //             ),
    //           }}
    //         />
    //       </div> */}
    //     </SidebarBody>
    //   </Sidebar>
    //   {/* <Dashboard /> */}
    // </div>
    <div
      style={{ backgroundColor: "rgb(8, 9, 10)" , borderRight: "0.5px  solid gray" }}
      className="rounded-md  flex flex-col  overflow-hidden h-screen w-full"
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink  key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>

  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      {/* <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span> */}
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center -sm -black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
// const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
//         Hello
//       {/* <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((i) => (
//             <div
//               key={"first-array" + i}
//               className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//         <div className="flex gap-2 flex-1">
//           {[...new Array(2)].map((i) => (
//             <div
//               key={"second-array" + i}
//               className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//       </div> */}
//     </div>
//   );
// };