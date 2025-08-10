import beep from "@assets/sounds/beep.wav";

export const playBeep = () => {
	const audio = new Audio(beep);
	audio.play().catch((e) => {
		console.warn("Audio playback failed:", e);
	});
};
