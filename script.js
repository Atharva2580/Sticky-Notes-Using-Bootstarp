const noteForm = document.getElementById("noteForm");
const editNoteForm = document.getElementById("editNoteForm");

const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");

const noteCount = document.getElementById("noteCount");
const searchInput = document.getElementById("searchInput");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteColor = document.getElementById("noteColor");

const editNoteId = document.getElementById("editNoteId");
const editNoteTitle = document.getElementById("editNoteTitle");
const editNoteContent = document.getElementById("editNoteContent");
const editNoteColor = document.getElementById("editNoteColor");


const addNoteModalElement =
    document.getElementById("addNoteModal");

const editNoteModalElement =
    document.getElementById("editNoteModal");

const addNoteModal =
    bootstrap.Modal.getOrCreateInstance(addNoteModalElement);

const editNoteModal =
    bootstrap.Modal.getOrCreateInstance(editNoteModalElement);


let notes = JSON.parse(
    localStorage.getItem("stickyNotes")
) || [];

displayNotes();

noteForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const color = noteColor.value;

    if (title === "" || content === "") {
        alert("Please enter both title and content.");
        return;
    }

    const newNote = {

        id: Date.now(),

        title: title,

        content: content,

        color: color,

        date: new Date().toLocaleString()

    };

    notes.unshift(newNote);

    saveNotes();
    displayNotes();
    noteForm.reset();
    addNoteModal.hide();

});


function displayNotes(searchTerm = "") {

    notesContainer.innerHTML = "";

    const filteredNotes = notes.filter(function (note) {

        const searchText = searchTerm.toLowerCase();

        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );

    });

    noteCount.textContent = filteredNotes.length;

    if (filteredNotes.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    filteredNotes.forEach(function (note) {

        const noteColumn = document.createElement("div");

        noteColumn.className =
            "col-12 col-sm-6 col-lg-4";

        noteColumn.innerHTML = `

            <div class="note-card note-${note.color} h-100">

                <div class="note-actions">

                    <button
                        title="Edit"
                        onclick="openEditModal(${note.id})"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        title="Delete"
                        onclick="deleteNote(${note.id})"
                    >
                        <i class="bi bi-trash text-danger"></i>
                    </button>

                </div>

                <div class="pe-5">

                    <div class="note-title">
                        ${escapeHTML(note.title)}
                    </div>

                </div>

                <div class="note-content">
                    ${escapeHTML(note.content)}
                </div>

                <div class="note-date mt-4">

                    <i class="bi bi-clock me-1"></i>

                    ${note.date}

                </div>

            </div>

        `;

        notesContainer.appendChild(noteColumn);

    });

}

function deleteNote(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this note?");


    if (!confirmDelete) {
        return;
    }

    notes = notes.filter(function (note) {

        return note.id !== id;

    });

    saveNotes();

    displayNotes(searchInput.value);

}


function openEditModal(id) {

    const note = notes.find(function (note) {

        return note.id === id;

    });

    if (!note) {
        return;
    }

    editNoteId.value = note.id;

    editNoteTitle.value = note.title;

    editNoteContent.value = note.content;

    editNoteColor.value = note.color;

    editNoteModal.show();

}

editNoteForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const id = Number(editNoteId.value);


        const note = notes.find(function (note) {

            return note.id === id;

        });

        if (!note) {
            return;
        }

        note.title =
            editNoteTitle.value.trim();

        note.content =
            editNoteContent.value.trim();

        note.color =
            editNoteColor.value;

        saveNotes();

        displayNotes(searchInput.value);

        editNoteModal.hide();

    }
);

searchInput.addEventListener(
    "input",
    function () {

        displayNotes(searchInput.value);

    }
);

function saveNotes() {

    localStorage.setItem(
        "stickyNotes",
        JSON.stringify(notes)
    );

}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}