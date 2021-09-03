import MessageIcon from '@material-ui/icons/Message';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import PeopleIcon from '@material-ui/icons/People';
import AppsIcon from '@material-ui/icons/Apps';

export const sidebarItems = [
  {
    id: "thread",
    icon: <MessageIcon />,
    text: "Thread"
  },
  {
    id: "dms",
    icon: <InboxIcon />,
    text: "All DMs"
  },
  {
    id: "mentions",
    icon: <DraftsIcon />,
    text: "Mentions & Reactions"
  },
  {
    id: 'saveitems',
    icon: <BookmarkBorderIcon />,
    text: "Save Items"
  },
  {
    id: "people",
    icon: <PeopleIcon />,
    text: "People & Groups"
  },
  {
    id: "more",
    icon: <AppsIcon />,
    text: "More"
  }
]
