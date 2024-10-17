import { Block } from '@/core/block.ts';
import Handlebars from 'handlebars';

const profileTemplate = `
    <div>
    {{ userName }}
    </div>
`;

class UserProfile extends Block {
  render() {
    const template = Handlebars.compile(profileTemplate);
    return template({
      userName: this.props.userName,
      // button: this.props.button,
    });
  }
}

const profile = new UserProfile('div', {
  userName: 'John Doe',
});

setTimeout(() => {
  profile.setProps({
    userName: 'sadasdawdawdawdaw',
  });
}, 3000);

export default profile;
// button: new Button({ text: 'Change name' }),
