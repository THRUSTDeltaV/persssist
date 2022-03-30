import { createSlice } from '@reduxjs/toolkit';
import { IFile } from '../../../interfaces/ifile.interface';
import { AppBlockchain } from '../../../lib/blockchain';
import { AppStorage } from '../../../lib/storage';

const appBlockchain = new AppBlockchain();
const appStorage = new AppStorage();

export const blockchain = createSlice({
	name: 'blockchain',
	initialState: {
		filesMetadata: [],
		filesCount: 0,
	},
	reducers: {
		setFilesMetadata: (state, action) => {
			state.filesMetadata = action.payload;
			state.filesCount = action.payload.length;
		}
	},
});

export const { setFilesMetadata } = blockchain.actions;
export default blockchain.reducer;

export const fetchFilesMetadata = () => async (dispatch: any) => {
	const filesMetadata = await appBlockchain.getFilesMetadata();
	dispatch(setFilesMetadata(filesMetadata));
}

export const subscribeToEvents = () => (dispatch: any) => {
	const onData = () => dispatch(fetchFilesMetadata());
	appBlockchain.contractSubscription(onData)
}

export const uploadFile = async (
	file: IFile | null | undefined, 
	account: string, 
	successCallback: (hash: string) => void, 
	errorCallback: (e: any) => void
) => {
	if(!file) throw 'file not provided';
	const addResult = await appStorage.upload(file);
	return appBlockchain.uploadFileMetadata(
		addResult.path,
		addResult.size,
		file.type,
		file.name, 
		account,
		successCallback,
		errorCallback
	);
}