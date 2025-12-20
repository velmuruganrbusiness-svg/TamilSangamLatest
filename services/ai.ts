
export const aiService = {
  /**
   * AI refinement disabled - returns original content.
   */
  async refineTamilText(content: string, _category: string): Promise<string> {
    return content;
  },

  /**
   * AI summarization disabled - returns default text.
   */
  async summarizePost(_title: string, _content: string): Promise<string> {
    return "சுருக்கம் தற்காலிகமாக முடக்கப்பட்டுள்ளது.";
  }
};
