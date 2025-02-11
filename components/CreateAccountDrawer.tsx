"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";

const CreateAccountDrawer = ({children} : {children : React.ReactNode}) => {
    const [open, setOpen] = useState(false);

    const {register, handleSubmit, formState:{errors}, setValue, watch, reset} = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues : {
            name: "",
            type : "CURRENT",
            balance: "",
            isDefault : false
        },

    })

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Account</DrawerTitle>
          </DrawerHeader>
          <div>
            <form action=""></form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateAccountDrawer;
