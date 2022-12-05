import { ReactComponent as Story } from '../assets/story.svg'
import { SvgIcon } from '@mui/material';

export default function StoriesIcon(props) {
  return (
    <SvgIcon {...props}>
      <Story />
    </SvgIcon>
  )
}