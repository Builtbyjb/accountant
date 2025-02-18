// For authenticated users

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Banknote,
} from "lucide-react";
// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';

import { NavMain } from "~/components/navbar/navMain";
// import { NavProjects } from "~/components/navProjects"
import { NavUser } from "~/components/navbar/navUser";
import { TeamSwitcher } from "~/components/navbar/teamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Example User",
    email: "m@example.com",
    // avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    // {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    // },
    // {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "General Ledger",
      icon: BookOpen,
      isActive: true,
      isDisabled: false,
      items: [
        {
          title: "Record a Transaction",
          url: "/",
        },
        {
          title: "Journal Entries",
          url: "/journal",
          isDisabled: false,
        },
        {
          title: "T-Accounts",
          url: "/t-accounts",
          isDisabled: false,
        },
        {
          title: "Trial Balance",
          url: "/trial-balance",
          isDisabled: false,
        },
      ],
    },
    {
      title: "Financial Statements",
      icon: Banknote,
      isActive: false,
      isDisabled: true,
      items: [
        {
          title: "Income Statement",
          url: "#",
          isDisabled: false,
        },
        {
          title: "Shareholder's Equity Statement",
          url: "#",
          isDisabled: false,
        },
        {
          title: "Balance Sheet",
          url: "#",
          isDisabled: false,
        },
        {
          title: "Cashflow Statement",
          url: "#",
          isDisabled: false,
        },
      ],
    },
    // {
    //     title: "Documentation",
    //     url: "#",
    //     icon: BookOpen,
    //     items: [
    //         {
    //             title: "Introduction",
    //             url: "#",
    //         },
    //         {
    //             title: "Get Started",
    //             url: "#",
    //         },
    //         {
    //             title: "Tutorials",
    //             url: "#",
    //         },
    //         {
    //             title: "Changelog",
    //             url: "#",
    //         },
    //     ],
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings2,
    //     items: [
    //         {
    //             title: "General",
    //             url: "#",
    //         },
    //         {
    //             title: "Team",
    //             url: "#",
    //         },
    //         {
    //             title: "Billing",
    //             url: "#",
    //         },
    //         {
    //             title: "Limits",
    //             url: "#",
    //         },
    //     ],
    // },
  ],
  // projects: [
  //     {
  //         name: "Design Engineering",
  //         url: "#",
  //         icon: Frame,
  //     },
  //     {
  //         name: "Sales & Marketing",
  //         url: "#",
  //         icon: PieChart,
  //     },
  //     {
  //         name: "Travel",
  //         url: "#",
  //         icon: Map,
  //     },
  // ],
};

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} aria-describedby="sidebar">
      <SidebarHeader>
        <div className="flex items-center">
          <TeamSwitcher teams={data.teams} />
          {isMobile ? <SidebarTrigger className="ms-2" /> : null}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
