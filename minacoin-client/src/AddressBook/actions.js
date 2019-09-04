import { actions as searchActions } from "./SearchContacts";
import { actions as contactDetailsActions } from "./ContactDetails";

export const updateSearchPhrase = newPhrase =>
  (dispatch, getState, { httpApi }) => {
    console.log('phrase to be sent to api: ' + newPhrase)
    dispatch(
      searchActions.updateSearchPhraseStart({ newPhrase }),
    );

    httpApi.getFirst5MatchingContacts({ namePart: newPhrase })
      .then(({ data }) => {
        const matchingContacts = data.map(contact => ({
          id: contact.id,
          value: contact.name,
        }));
        // TODO something is wrong here
        dispatch(
          searchActions.updateSearchPhraseSuccess({ matchingContacts }),
        );
      })
      .catch(() => {
        //TODO: somethign missing here
        //added: dispatch(searchActions.updateSearchPhraseFailure())
        dispatch(
          searchActions.updateSearchPhraseFailure(),
        );
      });
  };

export const selectMatchingContact = selectedMatchingContact =>
  (dispatch, getState, { httpApi, dataCache }) => {

    // TODO something is missing here
    const getContactDetails = ({ id }) => {
      console.log('getContactDetails: ' + JSON.stringify(selectedMatchingContact));
      return httpApi
          .getContact({ contactId: selectedMatchingContact.id })
          .then(({ data }) => ({
            id: data.id,
            name: data.name,
            phone: data.phone,
            addressLines: data.addressLines,
            hasFailedToFetch: false
      }));
    };

    dispatch(
      searchActions.selectMatchingContact({ selectedMatchingContact }),
    );

    dispatch(
      contactDetailsActions.fetchContactDetailsStart(),
    );

    getContactDetails({ id: selectedMatchingContact.id })
      .then((contactDetails) => {
        // TODO something is missing here

        if (contactDetails) {
          dataCache.store({
            key: contactDetails.id,
          });
          //at this point, addressLines still exists
          console.log('getContactDetails2: ' + JSON.stringify(contactDetails));
          dispatch(
            contactDetailsActions.fetchContactDetailsSuccess({contactDetails}),
          );
        }
        else {
          // TODO something is wrong here
          console.log('fetchContactDetailsFailure');
          dispatch(
            contactDetailsActions.fetchContactDetailsFailure(),
          );
        }
      })
      .catch((e) => {
        alert(JSON.stringify(e))
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure(),
        );
      });
  };