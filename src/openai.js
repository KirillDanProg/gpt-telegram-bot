import {Configuration, OpenAIApi} from 'openai'
import config from "config";
import {createReadStream} from 'fs'


class Openai {
    roles = {
        ASSISTANT: 'assistant',
        USER: 'user',
        SYSTEM: 'system'
    }

    constructor(apiKey) {
        const configuration = new Configuration({apiKey})
        this.openai = new OpenAIApi(configuration)
    }

    async chat(messages) {
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages,
            })
            return response.data.choices[0].message
        } catch (e) {
            console.log('error while chat with gpt')
        }
    }

    async transcription(filePath) {
        try {
            const response = await this.openai.createTranscription(createReadStream(filePath), 'whisper-1')
            return response.data.text
        } catch (e) {
            console.log('error while transcription')
        }
    }

    async translation(filePath) {
        try {
            const response = await this.openai.createTranslation(
                createReadStream(filePath),
                "whisper-1"
            );
            return response.data.text
        } catch (e) {
            console.log('error while translation')
        }
    }

    async createImage(prompt) {
        try {
            return await this.openai.createImage({
                prompt,
                n: 1,
                size: "512x512",
            })
        } catch (e) {
            console.log('error while creating image')
        }
    }
}

const openApiKey = process.env.NODE_ENV === 'production' ? process.env.OPENAI_API_KEY : config.get('OPENAI_API_KEY')
export const openai = new Openai(openApiKey)
