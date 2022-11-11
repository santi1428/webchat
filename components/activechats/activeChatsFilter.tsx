export default function ActiveChatsFilter(): JSX {
  return (
    <div className="ml-7 w-full">
      <input
        type="text"
        className="rounded-2xl w-10/12 mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2  border border-customBorderColor text-bell"
        placeholder="Search"
      />
    </div>
  );
}
