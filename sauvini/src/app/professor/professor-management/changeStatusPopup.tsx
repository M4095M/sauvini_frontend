import Button from "@/components/ui/button";

export default function ChangeStatusPopup() {
  return (
    <div className="w-full max-w-3xl py-11 px-10 rounded-[52px] flex flex-col gap-12 bg-neutral-100">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-5xl">
          Change Status to Accepted?
        </div>
        <div className="font-medium text-neutral-400 text-xl">
          Are you sure you want to accept this professor’s application? This
          action will grant them access to the platform as a professor.
        </div>
      </div>
      {/* actions */}
      <div className="flex items-center gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text="Accepted Professor"
        />
      </div>
    </div>
  );
}
