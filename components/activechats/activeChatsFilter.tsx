import { useChatStore } from "../../lib/store";

export default function ActiveChatsFilter(): JSX {
  const setActiveChatsFilter = useChatStore(
    (state) => state.setActiveChatsFilter
  );

  const activeChatsFilter = useChatStore((state) => state.activeChatsFilter);

  return (
    <div className="ml-7 w-full">
      <input
        type="text"
        className="rounded-2xl w-10/12 mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2  border border-customBorderColor text-bell"
        placeholder="Search"
        value={activeChatsFilter}
        onChange={(e) => {
          setActiveChatsFilter(e.target.value);
        }}
      />
    </div>
  );
}
