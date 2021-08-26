import React, { useState } from 'react';
import CommandHeader from './CommandHeader.js';
import CommandDescription from './CommandDescription.js';
import './css/Command.css';

export default function Command(props) {
	const [toggle, setToggle] = useState(false);

	let sectionClass = "command ";
	if (toggle) {
		sectionClass += "toggled-command ";
	}

	return (
		<section className={sectionClass}>
			<CommandHeader name={props.name} onClick={() => { setToggle(current => !current) }} />
			<CommandDescription

				name={props.name}
				description={props.description}
				syntax={props.syntax}
				userChat={props.userChat}
				botChat={props.botChat}
				active={toggle}
				edit={props.edit}
			/>
		</section>
	);
}