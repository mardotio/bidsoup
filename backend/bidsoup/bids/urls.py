from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register(r'accounts', views.AccountViewSet, basename='account')
router.register(r'biditems', views.BidItemViewSet, basename='biditem')
router.register(r'bids', views.BidViewSet, basename='bid')
router.register(r'bidtasks', views.BidTaskViewSet, basename='bidtask')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'invitations', views.InvitationViewSet, basename='invitation')
router.register(r'signup', views.SignupViewSet, basename='signup')
router.register(r'unittypes', views.UnitTypeViewSet, basename='unittype')
router.register(r'users', views.UserViewSet, basename='user')

accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'bids', views.BidViewSet, basename='account-bid')
accounts_router.register(r'categories', views.CategoryViewSet, basename='account-category')

bids_router = routers.NestedSimpleRouter(router, r'bids', lookup='bid')
bids_router.register(r'categories', views.CategoryViewSet, basename='bid-category')
bids_router.register(r'biditems', views.BidItemViewSet, basename='bid-biditem')
bids_router.register(r'bidtasks', views.BidTaskViewSet, basename='bid-bidtask')

category_router = routers.NestedSimpleRouter(router, r'categories', lookup='category')
category_router.register(r'biditems', views.BidItemViewSet, basename='category-biditem')

urlpatterns = [
    path('login/', views.SessionLoginView.as_view()),
    path('csrftoken/', views.get_csrf_token),
    path('confirm/<link>/', views.confirm_from_magic, name='confirm'),
    path('', include(router.urls)),
    path('', include(accounts_router.urls)),
    path('', include(bids_router.urls)),
    path('', include(category_router.urls)),
]
