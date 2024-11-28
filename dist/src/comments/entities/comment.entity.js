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
exports.CommentEntity = void 0;
const entity_1 = require("src/common/entity");
const entities_1 = require("src/posts/entities");
const entities_2 = require("src/user/entities");
const typeorm_1 = require("typeorm");
let CommentEntity = class CommentEntity extends entity_1.BaseEntity {
};
exports.CommentEntity = CommentEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CommentEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.UserEntity, user => user.comment, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", entities_2.UserEntity)
], CommentEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.PostEntity, post => post.comment, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", entities_1.PostEntity)
], CommentEntity.prototype, "post", void 0);
exports.CommentEntity = CommentEntity = __decorate([
    (0, typeorm_1.Entity)('Comments')
], CommentEntity);
//# sourceMappingURL=comment.entity.js.map