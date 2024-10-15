import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useChatStore } from "../../lib/store";

dayjs.extend(relativeTime);

export default function Notification(props) {
  const notification: NotificationType = props.notification;
  const deleteNotification = props.deleteNotification;
  const changeSelectedChat = useChatStore(
    (state: any) => state.changeSelectedChat
  );

  return (
    <div
      className="flex flex-col px-3 hover:bg-bell cursor-pointer text-bell hover:text-background2 rounded-md border-b border-customBorderColor"
      onClick={() => changeSelectedChat(notification.sender)}
    >
      <div className="flex flex-row justify-between mt-4">
        <div className="inline-block h-8 w-8 relative self-center">
          <Image
            layout="fill"
            src={notification.sender.profilePhotoURL}
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <p className="text-md font-bold pb-1 self-center mr-auto ml-2">
          {notification.sender.name + " " + notification.sender.lastName}
        </p>
        <div className="self-center">
          <button
            onClick={() => {
              deleteNotification({ id: notification.id, type: "single" });
            }}
          >
            <FontAwesomeIcon
              icon={faCircleXmark}
              size={"sm"}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      <p className="text-sm pb-3 pt-3 font-bold">
        {dayjs(notification.createdAt).fromNow()}
      </p>
      <div className="flex flex-row  pb-3">
        <p className="text-justify text-sm">{notification.message}</p>
      </div>
    </div>
  );
}
