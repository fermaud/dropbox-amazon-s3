<template>
    <div class="dropbox">
        <b-container fluid class="bv-example-row">
            <b-row>
                <b-col offset-lg="2" lg="9" md="12" sm="12" class="dragdrop-container">
                    <b-row>
                        <b-col lg="8" md="6" sm="6" class="content-zone">
                            <h2 class="center">DropBox</h2>
                            <hr>
                            <div id="file-drag-drop" class="drop-zone">
                                <a @click="add_files()">
                                    <form ref="fileform">
                                        <div v-if="files.length == 0">
                                            <img class="upload-logo" src="../assets/upload.png" width="50" />
                                            <p class="drop-files">Déposez vos fichiers ici</p>
                                        </div>
                                        <div v-for="(file, key) in files" class="file-listing">
                                            {{ file.name }}
                                            <a @click.stop="removeFile(key); " style="z-index: 4">
                                                <img class="delete-logo cross-preview" src="../assets/delete.png" />
                                            </a>
                                        </div>
                                    </form>
                                </a>
                                <a class="submit-button" @click="submitFiles()" v-show="files.length > 0">Envoyer</a>
                            </div>
                        </b-col>
                        <b-col lg="4" md="6" sm="6" class="my-file-container">
                            <h2 class="center">Mes fichiers</h2>
                            <hr>
                            <div v-for="(value, file) in filesPath.length" class="file_list_container">
                                <a class="open-file" target="_blank" v-bind:href="urlFiles[file]"><p class="filename"> {{ onlineFiles[file] }}</p></a>
                                <a @click="delete_files(filesPath[file])">
                                    <img width="15" class="delete-logo" src="../assets/delete.png" />
                                </a>
                                <hr>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col lg="12" md="12" sm="12" hidden>
                    <label>
                        <input type="file" id="files" ref="files" multiple @change="handle_files_upload()" />
                    </label>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';

require('../assets/style/dropbox.css');

export default {
    name : "DropBox",
    mounted () {
        this.show_files();
        this.dragAndDropCapable = this.determineDragAndDropCapable();
        if (this.dragAndDropCapable) {
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(evt) {
                this.$refs.fileform.addEventListener(evt, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
            }.bind(this));
            this.$refs.fileform.addEventListener('drop', function(e) {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    this.files.push(e.dataTransfer.files[i]);
                }
            }.bind(this));
        }
    },
    data () {
        return {
            dragAndDropCapable: false,
            onlineFiles: [],
            files: [],
            filesNameTab : [],
            uploadPercentage: 0,
            filesPath: [],
            urlFiles: []
        };
    },
    methods: {
        extract_file_name: function (fileName) {
            return fileName.split('/')[fileName.split('/').length - 1].substr(13);
        },
        add_files() {
            this.$refs.files.click();
        },
        handle_files_upload() {
            let uploadedFiles = this.$refs.files.files;
            for (var i = 0; i < uploadedFiles.length; i++) {
                this.files.push(uploadedFiles[i]);
            }
        },
        determineDragAndDropCapable() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        },
        removeFile(key) {
            this.files.splice(key, 1);
        },
        submitFiles() {
            let formData = new FormData();
            for (var i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                formData.append('files[' + i + ']', file);
            }
            for (var i = 0; i < this.files.length; i++) {
                this.amazon_s3_upload(this.files[i]);
            }
            this.files = [];
        },
        delete_files: function(filePath) {
            var bucket = this.get_bucket();
            var params = {
                Bucket: process.env.AMAZON_S3_BUCKET,
                Key: filePath
            };
            bucket.deleteObject(params, (err, data) => {
                if (err) {
                    console.warn(err, err.stack);
                } else {
                    this.show_files();
                }
            });
        },
        show_files: function() {
            this.onlineFiles = [];
            this.filesPath = [];
            var bucket = this.get_bucket();
            bucket.listObjects({}, (err, resp) => {
                for (var i = 0; i < resp.Contents.length; i++) {
                    this.filesPath.push(resp.Contents[i].Key);
                    this.urlFiles.push(process.env.AMAZON_S3_URL + process.env.AMAZON_S3_BUCKET + "/" + resp.Contents[i].Key);
                    this.onlineFiles.push(this.extract_file_name(resp.Contents[i].Key));
                } 
            });
        },
        amazon_s3_upload: function(file) {
            var bucket = this.get_bucket();
            var fileName =  Date.now() + file.name;
            var fileLink = process.env.AMAZON_S3_URL + process.env.AMAZON_S3_BUCKET + "/" + fileName;
            this.filesNameTab.push(fileLink);
            var params = {
                Key: fileName,
                ACL: 'public-read',
                ContentType: file.type,
                Body: file
            };
            return bucket.putObject(params, function() {});
        },
        get_bucket: function() {
            var aws = require('aws-sdk');
            aws.config.update({
                'accessKeyId': process.env.AMAZON_S3_ACCESS_KEY_ID,
                'secretAccessKey': process.env.AMAZON_S3_SECRET_ACCESSS_KEY
            });
            aws.config.region = process.env.AMAZON_S3_REGION;
            return new aws.S3({
                params: {
                    Bucket: process.env.AMAZON_S3_BUCKET
                }
            });
        }
    }
};
</script>
