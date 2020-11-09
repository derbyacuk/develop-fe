import $ from 'jquery'
import chosen from 'chosen-js'


document.addEventListener('initchosen', () => {
    let subjectSelect = $('#subject').chosen();

    subjectSelect.change((e) => {
        let event = new Event('updated');
        document.querySelector("#subject").dispatchEvent(event);
    })
})
