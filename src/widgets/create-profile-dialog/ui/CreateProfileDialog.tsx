'use client';

import { useState } from 'react';

import { CreateProfileForm } from '@/features/create-profile-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

export function CreateProfileDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">Создать профиль</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Создание профиля</DialogTitle>
          <CreateProfileForm onModalToggle={onOpenChange} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
