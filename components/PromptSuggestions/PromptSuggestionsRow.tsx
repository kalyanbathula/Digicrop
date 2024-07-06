import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionRow = ({ onPromptClick }) => {
const prompts = [
    'How does DigiCrop perform crop analysis?',
    'What features does DigiCrop offer for monitoring crop health?',
    'How does DigiCrop help in identifying crop diseases?',
    'How can farmers use DigiCrop to improve crop yield?',
    'What types of crop data can be accessed through DigiCrop?',
    
];


  return (
    <div className="flex flex-row flex-wrap justify-start items-center py-4 gap-2">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)} />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
