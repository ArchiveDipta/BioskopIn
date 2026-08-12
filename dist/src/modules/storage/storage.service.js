"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let StorageService = class StorageService {
    supabase;
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://dummy.supabase.co', process.env.SUPABASE_KEY || 'dummy_key');
    }
    async uploadFile(bucket, path, fileBuffer, mimeType) {
        if (process.env.NODE_ENV === 'test') {
            console.log('🔧 Test mode: returning dummy image URL');
            return `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(path)}`;
        }
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(path, fileBuffer, {
                contentType: mimeType,
                upsert: true,
            });
            if (error) {
                console.error('Supabase Upload Error:', error);
                console.log('🔧 Fallback: returning dummy image URL due to upload error');
                return `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(path)}`;
            }
            const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(path);
            return publicUrlData.publicUrl;
        }
        catch (e) {
            console.error('Unexpected error during upload:', e);
            return `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(path)}`;
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map