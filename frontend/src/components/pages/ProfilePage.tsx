import { useAuth } from "../../providers/AuthProvider";
import { formatDate } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { PageHeader } from "../ui/PageHeader";
import { Surface } from "../ui/Surface";

export function ProfilePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader
          eyebrow="Account"
          title="Profile"
          description="Your identity and membership details."
        />
      </div>

      <Surface className="max-w-[700px] p-6">
        <div className="mb-6 flex items-center gap-[18px]">
          <div className="grid h-[72px] w-[72px] place-items-center rounded-[8px] bg-gradient-to-br from-[#1f6f43] to-[#124b2b] text-[28px] font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h2>{user?.name ?? "User"}</h2>
            <p>{user?.email ?? "No email"}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
          <div className="flex flex-col gap-1.5 rounded-[8px] border border-[#e5e7eb] p-4">
            <span className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">
              Member since
            </span>
            <strong>
              {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </strong>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[8px] border border-[#e5e7eb] p-4">
            <span className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">
              Last updated
            </span>
            <strong>
              {user?.updatedAt ? formatDate(user.updatedAt) : "N/A"}
            </strong>
          </div>
        </div>

        <Button variant="danger" type="button" onClick={signOut}>
          Sign out
        </Button>
      </Surface>
    </div>
  );
}
