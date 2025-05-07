import { Button } from "@/components/ui/button";
import { UserCreationDialog } from "./user-creation-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { useUser } from "@/context/user-context";

export function UserSelector() {
  const { currentUser } = useUser();

  if (!currentUser) {
    return (
      <UserCreationDialog
        trigger={
          <Button variant="brand" className="flex items-center gap-2">
            <PlusIcon />
            Criar conta
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <UserCreationDialog
        trigger={<Button variant="outline">Trocar conta</Button>}
      />
    </div>
  );
}
