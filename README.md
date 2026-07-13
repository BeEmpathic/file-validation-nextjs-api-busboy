# File validation busboy

This app is able to take care of file upload for you. It doesn't waste your resources and It won't crash if you by accident upload 20GB video file instead of your summer pictures. It prevents RAM waste which is wroth big money, and it prevents the bandwith waste as well on the backend and the frontend. So if the frontend won't prevent the bad upload backend will, mercilessly.

<img width="1550" height="767" alt="image" src="https://github.com/user-attachments/assets/1c56b124-6fd8-4f66-b6ff-e6999922f31f" />

<img width="1550" height="1840" alt="image" src="https://github.com/user-attachments/assets/13999acb-6fa8-4e18-93ea-b307c90f4170" />

## To run project:

### 1. Install:

- node.js / node package manager

### 2. Clone the project and unzip it

### 3. Run npm run dev

Inside the unpacked folder with the porject run:

This installs the packages:

```bash
npm i
```

then start the dev server:

```bash
npm run dev
```

you can do production server, but it's up to you.

## Disclaimer

This app has 5 minutes sending time cap on it, cause this is what timeout your browser is setting on you. To work around it you would have to chunk the file keep track of it and do some other crazy stuff. It will be added it in the future like next year.

## Additonal info

It uses busyboy cause this lib is incredibly good. I don't think that I could work on the filestream better than it does.
It's app is suppose to be a feature in my other app but It took like 3 months to develop and the main project took like 1 month to do xD, so this is kind of deep side project / feature xD.
And the cap makes it probably useless for me anyway xD, cause I think that like 15 minutes is a minimal requirement for file upload, and It will take like 6 months to bypass that cause it's so complicated and I don't like to live a project only working I prefer when It meets my standard.

## The future of the project

# It's frozen

<img width="699" height="1019" alt="image" src="https://github.com/user-attachments/assets/57339272-3dfe-407b-a8a0-fd5e1065708b" />

## explanation

For now I think the project is kind of done. I did all I needed in it for now.
I want to use it in my other project for now and see if it's enough.
Still didn't do the chunking, but I did so all files are sent at once which should improve the performence, there are still some issues with that tho, chunking would be the best.
So let's see this project in the future.
